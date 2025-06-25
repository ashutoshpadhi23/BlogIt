# frozen_string_literal: true

require "test_helper"
include FactoryBot::Syntax::Methods

class CategoryTest < ActiveSupport::TestCase
  def setup
    @category = build(:category)
  end

  def test_category_is_valid_with_valid_attributes
    assert @category.valid?
  end

  def test_category_requires_name
    @category.name = ""
    assert_not @category.valid?
    assert_includes @category.errors[:name], "can't be blank"
  end

  def test_category_name_cannot_exceed_maximum_length
    @category.name = "a" * (Category::MAXIMUM_NAME_LENGTH + 1)
    assert_not @category.valid?
    assert_includes @category.errors[:name], "is too long (maximum is #{Category::MAXIMUM_NAME_LENGTH} characters)"
  end

  def test_category_has_and_belongs_to_many_posts
    @category.save!
    organization = create(:organization)
    user = create(:user, organization: organization)
    post = create(:post, user: user, categories: [@category])
    assert_includes @category.posts, post
  end
end
