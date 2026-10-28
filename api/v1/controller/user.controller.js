const User = require('../models/user.model');
const ForgotPassword = require('../models/forgot-password.model');
const generate = require('../../../helpers/generate');
const senMailHelper = require('../../../helpers/sendMail');
const md5 = require('md5');

// [POST] /api/v1/users/register
module.exports.register = async (req, res) => {
  try {
    const {fullName, email, password, phone} = req.body;
    const existedUser = await User.findOne({
      email: email,
      deleted: false
    });
    if (!existedUser) {
      const encodedPassword = md5(password);
      console.log(req.body);
      const objectUser = new User({
        fullName: fullName,
        email: email,
        password: encodedPassword,
        phone: phone,
        token: generate.generateRandomString(20)
      });

      const result = await objectUser.save();
      res.cookie("token", objectUser.token);

      res.json({
        code: 200,
        message: "Đăng ký thành công !",
        token: result.token
      });
    } else {
      res.json({
        code: 400,
        message: "Email đã được sử dụng vui lòng sử dụng email khác!"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Đăng ký không thành công !"
    });
  }
}

// [POST] /api/v1/users/login
module.exports.login = async (req, res) => {
  try {
    // console.log(req.body);
    const email = req.body.email;
    const password = md5(req.body.password);
    const existedUser = await User.findOne({
      email: email,
      deleted: false
    });

    if (!existedUser) {
      res.json({
        code: 400,
        message: "Bạn chưa có tài khoản vui lòng đăng ký !"
      });
      return;
    }
    if (existedUser.password !== password) {
      res.json({
        code: 400,
        message: "Sai mật khẩu !"
      });
      return;
    }
    
    res.json({
      code: 200,
      message: "Đăng nhập thành công !",
      token: existedUser.token
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi !"
    });
  }
}

// [POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  console.log(email);
  const user = await User.findOne({
    email: email
  });
  if (!user) {
    res.json({
      code: 400,
      message: "Vui lòng nhập đúng email đã dùng để đăng ký tài khoản !"
    })
  } else {
    const otp = generate.generateRandomOtp(8);
    const html = `<p> Vui lòng nhập mã OPT sau <b>${otp}</b> để đổi mật khẩu.</p>
                  <p><b><i>Mã chỉ tồn tại trong 5 phút </i></b></p>`;
    const subject = "Nhập mã OTP";
    const timeExpire = 5;
    const objectForgotPassword = new ForgotPassword({
      email: email,
      otp: otp,
      expireAt: Date.now() + timeExpire * 60 * 1000,
    });
    await objectForgotPassword.save();
    senMailHelper.sendMail(email, subject, html);
    res.json({
      code: 200,
      message: "Vui lòng nhập mã OPT được gửi qua email !"
    })
  }
}

// [POST] /api/v1/users/passowrd/otp
module.exports.otp = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const optExisted = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });

  if (!optExisted) {
    res.json({
      code: 400,
      message: "Vui lòng nhận lại mã OTP !"
    });
    return;
  }

  const user = await User.findOne({
    email: email,
  }).select("-password");

  const token = user.token;

  res.json({
    code: 200,
    message: "Xác thực thành công !",
    token: token
  });
}

// [POST] /api/v1/users/password/change
module.exports.changePassword = async (req, res) => {
  try {
    const newPassword = md5(req.body.newPassword);
    const token = req.user.token;

    const user = await User.findOne({
      token: token,
      deleted: false
    });

    if (!user) {
      res.json({
        code: 400,
        message: "Không tồn tại người dùng !"
      });
      return;
    }

    if (newPassword == user.password) {
      res.json({
        code: 400,
        message: "Không được sử dụng mật khẩu này !"
      });
      return;
    }

    const result = await User.updateOne({
      token: token
    }, {
      password: newPassword
    });

    res.json({
      code: 200,
      message: 'Đổi mật khẩu thành công !'
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Đổi mật khẩu thất bại !"
    });
  }
}

// [GET] /api/v1/users/logout
module.exports.logOut = async(req, res) =>{
  res.clearCookie("token");
  res.json({
    code: 200,
    message: "Đăng xuất thành công !"
  });
}

// [GET] /api/v1/users/
module.exports.list = async(req, res) =>{
  try{
    const listUser = await User.find({
      deleted: false
    }).select("fullName email");
    res.json({
      code: 200,
      message: "Lấy ra danh sách người dùng thành công !",
      data: listUser
    })
  }catch(error){
    console.log(error);
    res.json({
      code: 400, 
      message: "Lỗi không tìm thấy người dùng !"
    })
  }
}