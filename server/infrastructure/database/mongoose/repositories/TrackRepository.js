const ITrackRepository = require("../../../../domain/repositories/ITrackRepository");
const SingleChatPartnerTrack = require('../models/SingleChatPartnerIdTrack')

class TrackRepository extends ITrackRepository {
  async create(userId, partnerId) {
    return await SingleChatPartnerTrack.findOneAndUpdate(
      { userId: userId },
      { $addToSet: { singleChatPartnerTrack: partnerId } },
      { upsert: true, new: true }
    );;
  }

  async FindSingleChatPartnerTrack(userId) {
    return await SingleChatPartnerTrack.findOne({userId})
  }
}

module.exports = TrackRepository;