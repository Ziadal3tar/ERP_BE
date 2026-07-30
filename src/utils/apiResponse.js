export const success = (

    res,

    data,

    message = "Success",

    status = 200

) => {

    return res.status(status).json({

        success: true,

        message,

        data

    });

};

export const paginated = (

    res,

    data,

    pagination

) => {

    return res.status(200).json({

        success: true,

        data,

        pagination

    });

};