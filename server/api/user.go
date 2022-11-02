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
			"isSuccess": false,
			"message": "用户不存在或密码错误",
		})
		return
	}
	token, err := middleware.GenerateToken(cast.ToString(user.ID))
	if err != nil {
		log.Println(err)
	}
	c.JSON(http.StatusOK,gin.H{
		"isSuccess": true,
		"token": token,
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
			"isSuccess": false,
			"message": "用户名已存在",
		})
		return
	}
	c.JSON(http.StatusOK,gin.H{
		"isSuccess": true,
	})
}

// DeleteUser 注销账号
func DeleteUser(c *gin.Context){
	user := Current(c)
	err := user.DeleteUser()
	if err != nil {
		c.JSON(http.StatusOK,gin.H{
			"isSuccess": false,
			"message": "用户不存在",
		})
		return
	}
	c.JSON(http.StatusOK,gin.H{
		"isSuccess": true,
	})
}

// GetUser 获取用户信息
func GetUser(c *gin.Context){
	user := Current(c)
	c.JSON(http.StatusOK,gin.H{
		"user": user,
	})
}
