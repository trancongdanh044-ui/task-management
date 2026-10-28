const Task = require('../models/task.model');
const paginationHelper = require('../../../helpers/pagination');
const searchHelper = require('../../../helpers/search');

// [GET] /api/v1/tasks/
module.exports.index = async (req, res) => {
  try {
    // Search
    let find = {
      $or:[
        {createdBy: req.user.id},
        {listUser: req.user.id}, 
      ],
      deleted: false,
    };

    let objectSearch = searchHelper(req.query);
    if (req.query.keyword) {
      find.title = objectSearch.regex;
    }
    // console.log(find);
    // End Search

    // Status
    if (req.query.status) {
      find.status = req.query.status;
    }
    // End Status

    // Sort
    let objectSort = {};
    if (req.query.sortKey && req.query.sortValue) {
      objectSort[req.query.sortKey] = req.query.sortValue
    }
    // End Sort

    // Pagination
    let objectPagination = {
      currentPage: 1,
      deleted: false,
      limitItem: 2
    };

    const countTasks = await Task.countDocuments(find);
    objectPagination = paginationHelper(objectPagination, req.query, countTasks);
    console.log(objectPagination);
    // End Pagination

    // console.log(objectSort);
    const tasks = await Task.find(find)
      .sort(objectSort)
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip);

    res.json(tasks);
  } catch (error) {
    res.json("Không tìm thấy!");
  }
}

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const task = await Task.findOne({
      _id: id,
      deleted: false
    });
    res.json(task);

  } catch (error) {
    res.json("Không tìm thấy!");
  }
}

// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;
    console.log(req.body);
    const result = await Task.updateOne({
      _id: id
    }, {
      status: status
    })
    res.json({
      code: 200,
      message: "Cập nhật thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại!"
    });
  }
}

// [PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const {ids, key, value} = req.body;
    switch (key) {
      case "status":
        await Task.updateMany({
          _id: {
            $in: ids
          }
        }, {
          status: value
        });
        res.json({
          code: 200,
          message: "Cập nhật thành công!"
        });
        break;
      case "deleted":
        await Task.updateMany({
          _id: {$in: ids}
        }, {deleted: true});
        res.json({
          code: 200,
          message: "Xoá thành công!"
        });
        break;
      default:
        res.json({
          code: 400,
          message: "Không tồn tại!"
        });
        break;
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại!"
    });
  }
}

// [POST] /api/v1/tasks/create
module.exports.create = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    if(!req.body.timeStart){
      req.body.timeStart = Date.now();
    }

    if(!req.body.timFinish){
      req.body.timeFinish = Date.now() + 60*60*1000;
    }

    if(req.body.taskParentId){
      const taskParentId = req.body.taskParentId;
      const task = await Task.findOne({
        _id: taskParentId,
        deleted: false
      });
      if(!task){
        return res.json({
          code: 400,
          message: "Công việc cha không tồn tại !"
        });
      }
    }

    const newTask = new Task(req.body);
    const result = await newTask.save();

    res.json({
      code: 200,
      message: "Thêm mới thành công!",
      data: result
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}

// [PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const task = await Task.updateOne({
      _id: id,
      deleted: false
    }, req.body);
    res.json(task);

  } catch (error) {
    res.json("Không tìm thấy!");
  }
}

// [DELETE] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const task = await Task.updateOne({
      _id: id
    }, {deleted: true});
    res.json({
      code: 200,
      message: "Xoá thành công!"
    });

  } catch (error) {
    res.json("Không tìm thấy!");
  }
}