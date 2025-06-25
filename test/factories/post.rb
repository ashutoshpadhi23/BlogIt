# frozen_string_literal: true

FactoryBot.define do
  factory :post do
    title { Faker::Lorem.sentence[0..49] }
    description { Faker::Lorem.paragraph(sentence_count: 2) }
    upvotes { rand(0..100) }
    downvotes { rand(0..100) }
    is_bloggable { [true, false].sample }
    status { %w[draft published].sample }
    association :user, factory: :user
    after(:build) do |post|
      post.categories << create(:category)
    end
  end
end
