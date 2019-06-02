get = (req, res, next) => {
    var query;
    if (req.query.name) {
        query = req.models.Student.findOne({ name: req.query.name })
    } else {
        query = req.models.Student.find()
    }
    query.exec().then((student) => {
        return res.send(student);
    }).catch((error) => {
        next(error)
    })
}

getById = (req, res, next) => {
    req.models.Student.findById(req.params.id).then((student) => {
        return res.send(student)
    }).catch((error) => {
        next(error)
    })
}

post = (req, res, next) => {
    req.models.Student.create({
        name: req.body.name,
        email: req.body.email,
        address: {
            street: req.body.address.street,
            city: req.body.address.city,
            zipcode: req.body.address.zipcode
        }
    }).then((student) => {
        return res.status(201).send(student)
    }).catch((error) => {
        next(error)
    })
}

put = (req, res, next) => {
    req.models.Student.updateOne({_id: req.params.id},
        {
            name: req.body.name,
            email: req.body.email,
            address: {
                street: req.body.address.street,
                city: req.body.address.city,
                zipcode: req.body.address.zipcode,
            },
        }, {
            new: true,
            upsert: true,
            runvalidators: true,
        }).then((status) => {
            console.log("status: ", status)
            if (status.upserted)
                res.status(201)
            else if (status.nModified)
                res.status(200)
            else 
                res.status(204)
            res.send()
        }).catch((error) => next(error))
}

deleteStudent = (req, res, next) => {
    req.models.Student.findByIdAndDelete(
        req.params.id
    ).then((student) => {
        if (student)
            return res.status(200).send(`${student.name} has been deleted`)
        res.sendStatus(204)
    }).catch((error) => {
        next(error)
    })
}

module.exports = {
    get,
    post,
    put,
    deleteStudent,
    getById,
}