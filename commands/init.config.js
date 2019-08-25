module.exports = {
    PROJECT_SETUP_QUESTIONS: [
        {
            type: 'input',
            name: 'name',
            message: 'Please provide desired project name.'
        },
        {
            type: 'input',
            name: 'id',
            message: 'Please provide desired project id.'
        },
        {
            type: 'input',
            name: 'title',
            message:
                'Please provide desired project title. Used in index.html file.'
        },
        {
            type: 'input',
            name: 'description',
            message:
                'Please provide desired project description. Used in package.json file and <meta type="description"/>'
        },
        {
            type: 'input',
            name: 'author.name',
            message: 'Please provide project author name.'
        },
        {
            type: 'input',
            name: 'author.email',
            message: 'Please provide project author email.'
        },
        {
            type: 'input',
            name: 'keywords',
            message:
                'Please provide desired project keywords. Use "," to separate them.'
        }
    ]
};
