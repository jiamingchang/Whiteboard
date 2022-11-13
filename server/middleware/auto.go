package middleware

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
	"whiteboard/models"
)

// AuthRequired token验证中间件
func AuthRequired() gin.HandlerFunc {
	return func(context *gin.Context) {
		var code int
		var mesg string
		// 从header里获取token
		token := context.Request.Header.Get("token")
		// 验证token是否合法
		if token == "" {
			code = http.StatusUnauthorized
			mesg = "没有携带token"
			context.JSON(code, gin.H{
				"code": code,
				"message": mesg,
				"data": "",
			})
			// context.Abort() 若token验证失败，调用此函数确保该请求的其他函数不会被调用
			context.Abort()
			return
		} else {
			claims, err := ParseToken(token)
			if err != nil {
				code = http.StatusForbidden
				mesg = "token验证失败"
				context.JSON(code, gin.H{
					"code": code,
					"message": mesg,
					"data": "",
				})
				context.Abort()
				return
			} else if time.Now().Unix() > claims.ExpiresAt {
				code = http.StatusForbidden
				mesg = "token已过期"
				context.JSON(code, gin.H{
					"code": code,
					"message": mesg,
					"data": "",
				})
				context.Abort()
				return
			}
			// 获取用户信息
			user, err := models.GetUser(claims.UserID)
			if err != nil {
				context.JSON(http.StatusOK, gin.H{
					"code": 500,
					"message": "用户不存在",
					"data": "",
				})
				context.Abort()
				return
			}
			context.Set("user", user)
		}
	}
}
