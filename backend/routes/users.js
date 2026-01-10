import { clerkClient } from '@clerk/clerk-sdk-node';

function formatUser(user) {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.emailAddresses && user.emailAddresses.length > 0
            ? user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress || user.emailAddresses[0].emailAddress
            : null,
        imageUrl: user.imageUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastSignInAt: user.lastSignInAt
    };
}

async function getAll(req, res) {
    try {
        const { data, totalCount } = await clerkClient.users.getUserList();
        const filteredUsers = data.map(formatUser);
        res.json({
            data: filteredUsers,
            totalCount: totalCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function update(req, res) {
    try {
        const userId = req.params.id;
        if (!req.body?.role || !req.body?.studentId) {
            return res.status(400).json({ error: "role and studentId are required fields." });
        }

        const user = await clerkClient.users.getUser(userId);

        data = user.privateMetadata || {};
        data.role = req.body.role;
        data.studentId = req.body.studentId;

        const updatedUser = await clerkClient.users.updateUser(userId, {
            privateMetadata: data
        });

        res.json(formatUser(updatedUser));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { getAll, update };
