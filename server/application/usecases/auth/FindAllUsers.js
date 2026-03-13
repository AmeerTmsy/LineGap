class FindAllUsers {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(conditions = {}) {
        const users = await this.userRepository.findAllUsers(conditions)
        return users || []
    }
}

module.exports = FindAllUsers