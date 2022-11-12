const Koa = require("koa");
const cors = require("koa-cors");
const path = require("path");
const fs = require("fs");
const bodyParser = require("koa-bodyparser");
const KoaBody = require("koa-body");
const KoaStatic = require("koa-static");
const Router = require("koa-router");

const router = Router({
  prefix: "/static",
});

const _dirname = path.resolve();
const app = new Koa();

//上传图片/文件 必须写在跨域前面，原因暂时还没明白
app.use(
  KoaBody({
    multipart: true, //开启支持 文件上传
    formidable: {
      //关于文件上传的相关配制
      // 在配制选项option里, 不推荐使用相对路径
      // 在option里的相对路径, 不是相对的当前文件. 相对process.cwd()
      uploadDir: path.join(_dirname, "/public/uploads/"),
      //允许保留后缀名
      keepExtensions: true,
      multipart: true,
    },
    jsonLimit: "10mb",
    formLimit: "10mb",
    textLimit: "10mb",
    parsedMethods: ["POST", "PUT", "PATCH", "DELETE"],
  })
);
// post参数
app.use(bodyParser());
app.use(KoaStatic(path.join(_dirname, "/public")));
// 跨域处理
app.use(cors());

router.post("/uploadBase64", async (ctx) => {
  try {
    let { base64, sourceId } = ctx.request.body;
    base64 = base64.replace(/^data:image\/\w+;base64,/, "");
    let buffer = Buffer.from(base64, "base64");
    await fs.writeFile(
      `public/uploads/baiban-${sourceId}.png`,
      buffer,
      (err) => {
        if (err) throw err;
      }
    );
    ctx.body = {
      code: 200,
      message: "上传成功",
      data: `/uploads/baiban-${sourceId}.png`,
    };
  } catch (err) {
    console.log(err);
    ctx.body = {
      code: 500,
      message: "服务器错误！",
      data: null,
    };
  }
});

app.use(router.routes(), router.allowedMethods());

app.listen(4001, () => {
  console.log(`server is alerday 4001 start`);
});
