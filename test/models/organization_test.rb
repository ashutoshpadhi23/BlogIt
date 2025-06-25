# frozen_string_literal: true

require "test_helper"
include FactoryBot::Syntax::Methods

class OrganizationTest < ActiveSupport::TestCase
  def setup
    @organization = build(:organization)
  end

  def test_organization_is_valid_with_valid_attributes
    assert @organization.valid?
  end

  def test_organization_requires_name
    @organization.name = ""
    assert_not @organization.valid?
    assert_includes @organization.errors[:name], "can't be blank"
  end

  def test_organization_name_cannot_exceed_maximum_length
    @organization.name = "a" * (Organization::MAXIMUM_NAME_LENGTH + 1)
    assert_not @organization.valid?
    assert_includes @organization.errors[:name], "is too long (maximum is #{Organization::MAXIMUM_NAME_LENGTH} characters)"
  end

  def test_organization_has_many_users
    @organization.save!
    user1 = create(:user, organization: @organization)
    user2 = create(:user, organization: @organization)
    assert_includes @organization.users, user1
    assert_includes @organization.users, user2
  end

  def test_organization_has_many_posts_through_users
    @organization.save!
    user = create(:user, organization: @organization)
    post1 = create(:post, user: user)
    post2 = create(:post, user: user)
    assert_includes @organization.posts, post1
    assert_includes @organization.posts, post2
  end
end
