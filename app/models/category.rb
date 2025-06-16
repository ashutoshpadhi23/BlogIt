# frozen_string_literal: true

class Category < ApplicationRecord
  MAXIMUM_NAME_LENGTH = 255

  has_and_belongs_to_many :posts
  validates :name, presence: true, length: { maximum: MAXIMUM_NAME_LENGTH }
end
