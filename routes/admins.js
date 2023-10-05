const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

router.get('/:email', async (req, res, next) => {
    try {
        const { email } = req.params;
        console.log(email);
        res.sendStatus(202);
    } catch (error) {
        next(error);
    }
});

router.post('/login', [
    check('email').isEmail(),
    check('pwd').isLength({ min: 5 })
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, pwd } = req.body;
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
});

router.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send('Algo no salió bien!');
});

module.exports = router;
