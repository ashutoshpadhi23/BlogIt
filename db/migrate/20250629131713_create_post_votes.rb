# frozen_string_literal: true

class CreatePostVotes < ActiveRecord::Migration[7.1]
  def change
    create_table :post_votes do |t|
      t.references :post, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :vote_type
      t.index [:post_id, :user_id], unique: true
      t.timestamps
    end
  end
end
