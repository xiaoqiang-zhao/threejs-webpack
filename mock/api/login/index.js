/**
 * @file  mock 登录
 * @author zxq
 */

module.exports = function () {
    // return {
    //     code: '',
    //     messageChs: '暂无',
    //     message: 'no',
    //     data: {
    //         user: {
    //             _id: '1',
    //             mobile: 13000000000,
    //             token: '456'
    //         }
    //     }
    // };

    // 登录失败
    return {
        code: '',
        messageChs: '账号密码不匹配',
        message: 'no',
        data: ''
    };
};
