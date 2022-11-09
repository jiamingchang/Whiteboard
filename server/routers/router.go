package routers

import (
	"github.com/gin-gonic/gin"
	"whiteboard/api"
	"whiteboard/middleware"
	"whiteboard/setting"
)

func RoutesController() *gin.Engine {
	router := gin.Default()
	gin.SetMode(setting.ServerSettings.RunMode)

	// 实时传输数据(ws)
	router.GET("/wb/live", api.KeepLive)

	v1 := router.Group("/wb/")
	{
		// 用户登录
		v1.POST("login", api.Login)
		// 用户注册
		v1.POST("addUser", api.AddUser)
	}

	v2 := router.Group("/wb/", middleware.AuthRequired())
	{
		// 自动登录
		v2.POST("auto", api.Auto)
		// 用户注销
		v2.DELETE("deleteUser", api.DeleteUser)
		// 获取用户信息
		v2.GET("getUser", api.GetUser)

		// 创建房间
		v2.POST("createRoom", api.CreateRoom)
		// 获取房间 信息
		v2.GET("getRoom", api.GetRoom)
		// 获取用户所在房间
		v2.GET("getUserRoom", api.GetUserRoom)
		// 更新房间 信息
		v2.POST("updateRoom", api.UpdateRoom)
		// 用户请求房主更换权限
		v2.POST("askRoom", api.AskRoom)
		// 加入房间
		v2.POST("joinRoom", api.JoinRoom)
		// 退出房间
		v2.POST("exitRoom", api.ExitRoom)
	}

	return router
}
