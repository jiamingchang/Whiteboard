package api

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"whiteboard/models"
)

// CreateRoom 创建房间(默认加入)
func CreateRoom(c *gin.Context){
	var json struct{
		ReadOnly uint	`json:"read_only" validate:"required"`
	}
	if !BindAndValid(c, &json){
		return
	}
	user := Current(c)

	room, ok:=user.GetUserRoom()
	if ok{
		c.JSON(http.StatusOK,gin.H{
			"code": 500,
			"message": "无法创建/加入多个房间",
			"data": room,
		})
		return
	}

	room = user.CreateRoom(json.ReadOnly)
	c.JSON(http.StatusOK,gin.H{
		"code": 200,
		"message": "创建房间成功",
		"data": room,
	})
}

// GetRoom 获取房间信息
func GetRoom(c *gin.Context){
	uid := c.Query("uid")
	room := models.GetRoom(uid)
	if room.ID!=0{
		c.JSON(http.StatusOK,gin.H{
			"code": 200,
			"message": "获取房间信息成功",
			"data": room,
		})
	}else{
		c.JSON(http.StatusOK,gin.H{
			"code": 500,
			"message": "房间不存在",
			"data": "",
		})
	}

}

// GetUserRoom 获取用户所在房间
func GetUserRoom(c *gin.Context){
	user := Current(c)
	room, ok := user.GetUserRoom()
	if ok{
		c.JSON(http.StatusOK,gin.H{
			"code": 200,
			"message": "获取用户所在房间信息成功",
			"data": room,
		})
	}else{
		c.JSON(http.StatusOK,gin.H{
			"code": 500,
			"message": "未创建/加入房间",
			"data": "",
		})
	}
}

// AskRoom 用户请求房主更换权限
func AskRoom(c *gin.Context){
	var json struct{
		ReadOnly uint	`json:"read_only" validate:"required"`
	}
	if !BindAndValid(c, &json){
		return
	}

	user := Current(c)

	room, ok:=user.GetUserRoom()
	if !ok{
		c.JSON(http.StatusOK,gin.H{
			"code": 500,
			"message": "未创建/加入房间",
			"data": "",
		})
		return
	}
	if room.ReadOnly == json.ReadOnly{
		c.JSON(http.StatusOK,gin.H{
			"code": 500,
			"message": "无需请求改变房间权限",
			"data": "",
		})
		return
	}

	go func(user models.User) {
		SysSendRoomer(user.GetRoomer(), mess{Code: 105, System: "用户请求更改权限:"+ strconv.Itoa(int(json.ReadOnly))})
	}(user)

	c.JSON(http.StatusOK,gin.H{
		"code": 200,
		"message": "请求改变房间权限消息发送成功",
		"data": "",
	})
}


// UpdateRoom 更新房间信息
func UpdateRoom(c *gin.Context){
	var json struct{
		ReadOnly uint	`json:"read_only" validate:"required"`
	}
	if !BindAndValid(c, &json){
		return
	}

	user := Current(c)

	_, ok:=user.GetUserRoom()
	if !ok{
		c.JSON(http.StatusOK,gin.H{
			"code": 500,
			"message": "未创建/加入房间",
			"data": "",
		})
		return
	}

	num := user.UpdateRoom(json.ReadOnly)
	if num == 2 {
		// 发送通知
		if json.ReadOnly==1 {
			go func(user models.User) {
				SysSend(user.GetRoomUser(), mess{Code: 103, System: "房主更改房间为只读"})
			}(user)
		}else if json.ReadOnly==2{
			go func(user models.User) {
				SysSend(user.GetRoomUser(), mess{Code: 104, System: "房主更改房间为协作"})
			}(user)
		}
		c.JSON(http.StatusOK,gin.H{
			"code": 200,
			"message": "成功改变房间权限",
			"data": "",
		})
	}else if num==3{
		c.JSON(http.StatusOK,gin.H{
			"code": 500,
			"message": "您不是创建者",
			"data": "",
		})
	}else if num==1{
		c.JSON(http.StatusOK,gin.H{
			"code": 500,
			"message": "无需改变房间权限",
			"data": "",
		})
	}
}

// JoinRoom 加入房间
func JoinRoom(c *gin.Context)  {
	var json struct{
		Uid 	 uint32	`json:"uid" validate:"required"`
	}
	if !BindAndValid(c, &json){
		return
	}
	user := Current(c)

	room, ok:=user.GetUserRoom()
	if ok{
		c.JSON(http.StatusOK,gin.H{
			"code": 500,
			"message": "无法创建/加入多个房间",
			"data": room,
		})
		return
	}
	if ok := user.JoinRoom(json.Uid);ok{
		user, _ = models.GetUser(user.ID)
		go func(user models.User) {
			SysSendRoomer(user.GetRoomer(), mess{Code: 101, System: "有用户加入房间"})
		}(user)

		c.JSON(http.StatusOK,gin.H{
			"code": 200,
			"message": "加入房间成功",
			"data": "",
		})
	}else{
		c.JSON(http.StatusOK,gin.H{
			"code": 500,
			"message": "房间不存在",
			"data": "",
		})
	}
}

// ExitRoom 退出房间
func ExitRoom(c *gin.Context){
	user := Current(c)
	_, ok:=user.GetUserRoom()
	if !ok{
		c.JSON(http.StatusOK,gin.H{
			"code": 500,
			"message": "未创建/加入房间",
			"data": "",
		})
		return
	}
	users := user.ExitRoom()

	// 发布通知
	go func(users []models.User){
		if len(users)>1{
			SysSend(users, mess{Code: 102, System: "房主已退出"})
		}
	}(users)

	c.JSON(http.StatusOK,gin.H{
		"code": 200,
		"message": "退出房间成功",
		"data": "",
	})
}