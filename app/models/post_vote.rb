# frozen_string_literal: true

class PostVote < ApplicationRecord
  enum vote_type: { upvote: "upvote", downvote: "downvote" }

  belongs_to :post
  belongs_to :user

  validates :user_id, uniqueness: { scope: :post_id, message: "has already voted on this post" }
end
