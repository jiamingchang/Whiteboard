package api

import (
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"sync"
	"time"
	"whiteboard/middleware"
	"whiteboard/models"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:   1024,
	WriteBufferSize:  1024,
	HandshakeTimeout: 5 * time.Second,
	// 取消ws跨域校验
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// cont 存储ws通道,对应的user,消息通道
type cont struct {
	userid uint
	user   models.User
	conn   *websocket.Conn
}

// mess 传输的数据
// ---Code---
// 100:成功接入ws
// 101:有用户加入房间
// 102:房主已退出
// 103:房主更改房间为只读
// 104:房主更改房间为协作
// 105:用户请求更改权限:read_only(1:只读，2:协作)
type mess struct {
	Message string `json:"message"`
	Code 	int `json:"code"`
	System  string `json:"system"`
}

var conts []cont
var mux sync.Mutex

// KeepLive 处理ws请求
func KeepLive(c *gin.Context) {
	var conn *websocket.Conn
	var err error

	conn, err = upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("Failed to set websocket upgrade: %+v", err)
		return
	}

	var _json struct {
		Token string `json:"token"`
	}

	err = conn.ReadJSON(&_json)
	if err != nil {
		log.Println("read json err:", err)
		_ = conn.Close()
		return
	}

	// 验证user身份
	claims, err := middleware.ParseToken(_json.Token)
	if err != nil {
		log.Println("ParseToken err:", err)
		_ = conn.Close()
		return
	}

	user, err := models.GetUser(claims.UserID)
	if err!=nil{
		log.Println("user does not exist:", err)
		_ = conn.Close()
		return
	}
	_ = conn.WriteJSON(&mess{Code: 100, System: "成功接入ws"})

	// 保存上下文
	addClient(user, conn)

	go readdata(user.ID)
}


// readdata 在conn中读取data
func readdata(id uint){
	con := getClients(id)
	for{
		var me mess
		conn:= con.conn
		err := conn.ReadJSON(&me)
		if err !=nil {
			log.Println(err)
			return
		}
		//log.Println(me)
		send(con, me)
	}
}

// writedata 在conn中写入data
func writedata(id uint, me mess){
	con := getClients(id)

	// 提高容灾性
	if con.conn==nil{
		return
	}
	err := con.conn.WriteJSON(&me)
	if err != nil {
		log.Println(err)
		return
	}
}

// send 消息处理
func send(con cont, me mess){
	users := con.user.GetRoomUser()
	for _,u := range users{
		if u.ID != con.userid{
			writedata(u.ID, me)
		}
	}
}

// SysSend 系统通知(房主发送)
func SysSend(users []models.User, me mess){
	for i,u := range users{
		if i != 0{
			writedata(u.ID, me)
		}
	}
}

// SysSendRoomer 系统通知(发送给房主)
func SysSendRoomer(user models.User, me mess){
	writedata(user.ID, me)
}

func addClient(user models.User, conn *websocket.Conn) {
	mux.Lock()
	con := cont{
		userid: user.ID,
		user: user,
		conn: conn,
	}
	conts = append(conts, con)
	mux.Unlock()
}

func getClients(id uint) (con cont) {
	mux.Lock()
	for _,_con := range conts {
		if _con.userid == id{
			con = _con
		}
	}
	mux.Unlock()
	return
}

func deleteClient(id uint) {
	mux.Lock()
	for i,con := range conts {
		if con.userid == id{
			_ = con.conn.Close()
			conts = append(conts[:i], conts[i+1:]...)
			break
		}
	}
	mux.Unlock()
}


// 服务器心跳机制
var pingTicker  = time.NewTicker(time.Second * 2)
func live() {
	for {
		select {
		case <-pingTicker.C:
			// 服务端心跳:每2秒ping一次客户端，查看其是否在线
			for _, con := range conts {
				conn := con.conn
				_ = conn.SetWriteDeadline(time.Now().Add(time.Second * 2))
				err := conn.WriteMessage(websocket.PingMessage, []byte{})
				if err != nil {
					log.Println("send ping err:", err)
					users := con.user.ExitRoom()
					// 发布通知
					go func(users []models.User){
						if len(users)>1{
							SysSend(users, mess{System: "房主已退出"})
						}
					}(users)
					deleteClient(con.userid)
				}
			}
		}
	}
}

func init(){
	go live()
}

