4. SERIALIZE 当身份验证有效时，将执行SERIALIZE METHOD(开始会话)(使用在该方法的定义中传递的任何参数)，通常将保存User.id并在每次发送请求时对其进行验证.

passport.serializeUser(function(user，done){ 完成(null，user._id); })

在上述方法中，传递了用户对象，并将user._id作为密钥保存在服务器中. 这意味着该密钥(user.id)将用于维护会话.

这是通过将user._id保存在req.passport.session.user = {_ id:…}…中来完成的.(反序列化后说明)

5. 反序列化 序列化方法仅在身份验证之后执行一次，之后，对于后续请求，将执行DESERIALIZE方法，该方法将维护会话，在该会话中传递User.id来维护会话，如下所示. (直到浏览器打开*).

passport.deserializeUser(function(id，done){…})

用户对象在回调中返回，并作为req.user附加到请求.

认证/未认证:

您还记得App.js中的 passport.initialize中间件和 passport.session中间件吗?

对护照的初始化中间件将在每个请求上执行. 之后，passport.session中间件将在服务器上寻找序列化的用户.

如果未完成用户身份验证，则会创建一个空对象(req.session.passport.user)，该对象将加载已序列化的用户.

req.session.passport.user = {}.

但是，当身份验证完成并且Passport.Authenticate在完成的回调中返回了VALID USER(用户名和密码匹配)，然后

req.session.passport.user = user._id

User._id传递给req.session.passport.user

下次在后续请求中再次执行passport.initialize时，此ID将附加在会话(req.sesssion.passport.user)上.

initialize方法在会话中找到ID后，将执行反序列化方法&通过req.user将用户信息加载到请求中.

请对此答案提出建议编辑或补充. -PVTHOMAS

What is the use of serialize and deserialize methods in passport-authentication.
解决方案

I had a hard time wrapping my head around it.But this is what i got, hope it saves your time.

There are two ways you could interact with the server to provide access to restricted information which requires authentication. 1.cookies and 2.sessions

Long story short- cookies are unsafe as it remains on the client side and can be accessed and manipulated.

But when it comes to sessions the session id (to be explained) gets saved in the server, thus making it a safe bet.

This is how the process goes with the passport middleware:

    Login info passed (username & password)
    Passport Authenticate(local strategy) gets executed to check if username and password is valid.
    DONE callback with Null (no error) and USER(from database) will be returned  if username and password is VALID.

4.SERIALIZE When Authentication is valid SERIALIZE METHOD IS EXECUTED (to begin a session) (which uses whatever parameter is passed in the definition of the method ) usually User.id is saved and is verified each time a request is sent.

passport.serializeUser(function(user, done) { done(null, user._id); })

In the above method, user object is passed and user._id is saved as a key in the server. This means that this key(user.id) would be used to maintain the session.

This is done by saving the user._id in the req.passport.session.user ={_id : …}….(explained after Deserialize)

5.DESERIALIZE Serialize method is executed only once after authentication, and later on, for subsequent requests the DESERIALIZE METHOD gets executed which maintains the session in which the User.id is passed to maintain the session as illustrated below. ( till the browser is open*) .

passport.deserializeUser(function(id, done){…})

user object is returned in the callback and is attached to the request as req.user.

AUTHENTICATION / NO AUTHENTICATION:

Do you remember the passport.initialize middleware and the passport.session middleware in App.js

The passport.initialize middleware is executed on every request. After which the passport.session middleware would look for a serialized user on the server.

If no user authentication has been done an empty object is created (req.session.passport.user) where the serialized user would be loaded.

req.session.passport.user = {}.

But when authentication has been done and Passport.Authenticate has returned a VALID USER in the done callback (username and password match case), then

req.session.passport.user = user._id

User._id is passed to req.session.passport.user

This Id will be present attached to the session (req.sesssion.passport.user) when passport.initialize is executed the next time in subsequent requests.

After initialize method finds the id in the session it performs the deserialize method & the User information is loaded to the request through req.user .

Please do suggest edits or additions to this answer.-PVTHOMAS

# jwt & session
前端需要跨域请求后端接口的时候，不推荐使用 Session 身份认证机制，推荐使用 JWT 认证机制

## jwt
### 工作原理
1. 用户的信息通过 Token 字符串的形式，保存在客户端浏览器中
2. 服务器通过还原 Token 字符串的形式来认证用户的身份

```
<header>.<payload>.<signature>
```
payload是经过加密后的用户信息。

client     server
1. c 请求登录 s
2. s 生成 jwt，并返回给c
3. c把jwt保存在ss/ls中
4. c在下次请求数据中，在header中的Authorization中使用jwt.
5. s收到jwt后，经过解析、验证jwt,再返回数据。

### 使用jwt

npm i jsonwebtoken express-jwt -S
jsonwebtoken 用于生成 JWT 字符串
express-jwt 用于将 JWT 字符串解析还原成 JSON 对象

## passport
1. 使用策略前必须定义策略。
2. 一直在session中维护登录信息。通过验证的用户必须序列化(serialize)到session。以后再请求是从session中反序列化(deserialize)
3. passport是一个中间件。必须把该中间件挂载到应用中。`app.use(passport.initialze())`。如何应用中使用了持续的login session.请一定要再使用`app.use(passport.session())`.
4. 
5. 


允许上传图片格式['jpg', 'jpeg', 'png', 'gif']

110101199003077774 张三
110101199003079534 李四
110101199003079016 王五
110101199003072850
110101199003070695

/students/levelCert
post
    name,
    gender,
    project_grade,
    project,
    id_card,
    approval_enterprises,
    approval_date,
    cert_number,
    photo

/students/levelCert
get
    idCardOrCertNumber

