class FindAllUsers {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(conditions = {}) {
        const users = await this.userRepository.findAllUsers(conditions)
        if (!users || users.length === 0) {
            const queryLabel = Object.keys(conditions).length > 0
                ? `matching these criteria: ${JSON.stringify(conditions)}`
                : "in the database";
            throw new Error(`No users found ${queryLabel}`);
        }
        return users
    }
}

module.exports = FindAllUsers