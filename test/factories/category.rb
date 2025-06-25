# frozen_string_literal: true

FactoryBot.define do
  factory :category do
    sequence(:name) { |n| "#{Faker::Lorem.unique.word}-#{n}" }
  end
end
