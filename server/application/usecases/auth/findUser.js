class FindUser {
    constructor(userRepository) {
        this.userRepository = userRepository
    }

    async execute({ id }) {
        const user = await this.userRepository.findById(id);
        // console.log(`user with id of ${id}: `, user)
        if (!user) {
            throw new Error("User does not exists");
        }
        return {
            name: user.name,
            email: user.email,
        };
    }
}

module.exports = FindUser