const {pool} = require('./config');

const getContacts = (request, response) => {
    pool.query('SELECT * FROM Contacts', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
}

const getChaseContacts = (request, response) => {
    const responded = 'f';

    pool.query('SELECT * FROM Contacts WHERE Responded = $1', [responded], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
}

const getAttendingContacts = (request, response) => {
    const attending = 'y';

    pool.query('SELECT * FROM Contacts WHERE Attending = $1', [attending], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
}

const getDeclinedContacts = (request, response) => {
    const responded = 'y';
    const attending = 'f';

    pool.query('SELECT * FROM Contacts WHERE Responded = $1 AND Attending = $2', [responded, attending], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
}

const getKatieParents = (request, response) => {
    const errorId1 = 13;

    pool.query('SELECT * FROM Contacts WHERE Id = $1', [errorId1], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
}

module.exports = {
    getContacts,
    getChaseContacts,
    getAttendingContacts,
    getDeclinedContacts,
	getKatieParents,
}