# frozen_string_literal: true

class Organization < ApplicationRecord
  MAXIMUM_NAME_LENGTH = 255
  has_many :users
  has_many :posts, through: :users
  validates :name, presence: true, length: { maximum: MAXIMUM_NAME_LENGTH }
end
