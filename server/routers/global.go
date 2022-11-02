package routers

import (
	"github.com/gin-gonic/gin"
	"whiteboard/api"
	"whiteboard/middleware"
	"whiteboard/models"
)

func RoutesController() *gin.Engine {
	router := gin.Default()

	// 实时传输数据
	router.GET("/send", models.Send)

	v1 := router.Group("/wb/")
	{
		// 用户登录
		v1.POST("login", api.Login)
		// 用户注册
		v1.POST("addUser", api.AddUser)
	}

	v2 := router.Group("/wb/", middleware.AuthRequired())
	{
		// 用户注销
		v2.DELETE("deleteUser", api.DeleteUser)
		// 获取用户信息
		v2.GET("getUser", api.GetUser)

	}

	return router
}
