package api

import (
	"github.com/gin-gonic/gin"
	"github.com/spf13/cast"
	"log"
	"net/http"
	"whiteboard/middleware"
	"whiteboard/models"
)

// Login 登录账号
func Login(c *gin.Context){
	var json struct{
		Name string `json:"name" validate:"required"`
		Password string `json:"password" validate:"required"`
	}
	if !BindAndValid(c, &json){
		return
	}

	user, err := models.Login(json.Name, json.Password)
	if err != nil {
		c.JSON(http.StatusOK,gin.H{
			"code": 500,
			"message": "用户不存在或密码错误",
			"data": "",
		})
		return
	}
	token, err := middleware.GenerateToken(cast.ToString(user.ID))
	if err != nil {
		log.Println(err)
	}
	c.JSON(http.StatusOK,gin.H{
		"code": 200,
		"message": "登录成功",
		"data": token,
	})
}

// Auto 自动登录
func Auto(c *gin.Context){
	c.JSON(http.StatusOK,gin.H{
		"code": 200,
		"message": "登录成功",
		"data": "",
	})
}


// AddUser 注册账号
func AddUser(c *gin.Context){
	var json models.User
	if !BindAndValid(c, &json){
		return
	}
	err := models.AddUser(json)
	if err == nil {
		c.JSON(http.StatusOK,gin.H{
			"code": 500,
			"message": "用户名已存在",
			"data": "",
		})
		return
	}
	c.JSON(http.StatusOK,gin.H{
		"code": 200,
		"message": "注册成功",
		"data": "",
	})
}

// DeleteUser 注销账号
func DeleteUser(c *gin.Context){
	user := Current(c)
	err := user.DeleteUser()
	if err != nil {
		c.JSON(http.StatusOK,gin.H{
			"code": 500,
			"message": "用户不存在",
			"data": "",
		})
		return
	}
	c.JSON(http.StatusOK,gin.H{
		"code": 200,
		"message": "注销成功",
		"data": "",
	})
}

// GetUser 获取用户信息
func GetUser(c *gin.Context){
	user := Current(c)
	c.JSON(http.StatusOK,gin.H{
		"code": 200,
		"message": "获取用户信息成功",
		"data": user,
	})
}
