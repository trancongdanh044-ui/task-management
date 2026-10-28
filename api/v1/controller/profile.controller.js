const User = require("../models/user.model");

// [GET] /api/v1/profile/detail
module.exports.detail = async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    if (otherUserId) {
      const otherUser = await User.findOne({
        _id: otherUserId,
        deleted: false
      }).select("-password -deleted -token");
      return res.json(otherUser);
    }
    const user = req.user;
    res.json(user);
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tìm thấy thông tin người dùng !"
    })
  }
}