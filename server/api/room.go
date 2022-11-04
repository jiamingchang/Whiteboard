package api

import (
	"github.com/gin-gonic/gin"
	"net/http"
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
			"isSuccess": false,
			"message": "无法创建/加入多个房间",
			"room": room,
		})
		return
	}

	room = user.CreateRoom(json.ReadOnly)
	c.JSON(http.StatusOK,gin.H{
		"isSuccess": true,
		"room": room,
	})
}

// GetRoom 获取房间信息
func GetRoom(c *gin.Context){
	uid := c.Query("uid")
	room := models.GetRoom(uid)
	if room.ID!=0{
		c.JSON(http.StatusOK,gin.H{
			"isSuccess": true,
			"room": room,
		})
	}else{
		c.JSON(http.StatusOK,gin.H{
			"isSuccess": false,
			"message": "房间不存在",
		})
	}

}

// GetUserRoom 获取用户所在房间
func GetUserRoom(c *gin.Context){
	user := Current(c)
	room, ok := user.GetUserRoom()
	if ok{
		c.JSON(http.StatusOK,gin.H{
			"isSuccess": true,
			"room": room,
		})
	}else{
		c.JSON(http.StatusOK,gin.H{
			"isSuccess": false,
			"message": "未创建/加入房间",
		})
	}
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
			"isSuccess": false,
			"message": "未创建/加入房间",
		})
		return
	}

	num := user.UpdateRoom(json.ReadOnly)
	if num == 2 {
		// 发送通知
		if json.ReadOnly==1 {
			go func(user models.User) {
				SysSend(user.GetRoomUser(), mess{System: "房主更改房间为只读"})
			}(user)
		}else if json.ReadOnly==2{
			go func(user models.User) {
				SysSend(user.GetRoomUser(), mess{System: "房主更改房间为协作"})
			}(user)
		}
		c.JSON(http.StatusOK,gin.H{
			"isSuccess": true,
		})
	}else if num==3{
		c.JSON(http.StatusOK,gin.H{
			"isSuccess": false,
			"message": "您不是创建者",
		})
	}else if num==1{
		c.JSON(http.StatusOK,gin.H{
			"isSuccess": false,
			"message": "无需改变房间权限",
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
			"isSuccess": false,
			"message": "无法创建/加入多个房间",
			"room": room,
		})
		return
	}

	if ok := user.JoinRoom(json.Uid);ok{
		c.JSON(http.StatusOK,gin.H{
			"isSuccess": true,
		})
	}else{
		c.JSON(http.StatusOK,gin.H{
			"isSuccess": false,
			"message": "房间不存在",
		})
	}
}

// ExitRoom 退出房间
func ExitRoom(c *gin.Context){
	user := Current(c)
	_, ok:=user.GetUserRoom()
	if !ok{
		c.JSON(http.StatusOK,gin.H{
			"isSuccess": false,
			"message": "未创建/加入房间",
		})
		return
	}
	users := user.ExitRoom()

	// 发布通知
	go func(users []models.User){
		if len(users)>1{
			SysSend(users, mess{System: "房主已退出"})
		}
	}(users)

	c.JSON(http.StatusOK,gin.H{
		"isSuccess": true,
	})
}