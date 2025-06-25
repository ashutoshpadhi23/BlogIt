# frozen_string_literal: true

require "test_helper"

class PostTest < ActiveSupport::TestCase
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category)
    @post = build(:post, user: @user, categories: [@category])
  end

  def test_post_is_valid_with_valid_attributes
    assert @post.valid?
  end

  def test_post_requires_title
    @post.title = ""
    assert_not @post.valid?
    assert_includes @post.errors[:title], "can't be blank"
  end

  def test_post_title_cannot_exceed_maximum_length
    @post.title = "a" * (Post::MAXIMUM_TITLE_LENGTH + 1)
    assert_not @post.valid?
    assert_includes @post.errors[:title], "is too long (maximum is #{Post::MAXIMUM_TITLE_LENGTH} characters)"
  end

  def test_post_requires_description
    @post.description = ""
    assert_not @post.valid?
    assert_includes @post.errors[:description], "can't be blank"
  end

  def test_post_description_cannot_exceed_maximum_length
    @post.description = "a" * (Post::MAXIMUM_DESCRIPTION_LENGTH + 1)
    assert_not @post.valid?
    assert_includes @post.errors[:description], "is too long (maximum is #{Post::MAXIMUM_DESCRIPTION_LENGTH} characters)"
  end

  def test_post_requires_is_bloggable_to_be_true_or_false
    @post.is_bloggable = nil
    assert_not @post.valid?
    assert_includes @post.errors[:is_bloggable], "is not included in the list"
  end

  def test_post_requires_at_least_one_category
    @post.categories = []
    assert_not @post.valid?
    assert_includes @post.errors[:categories], "can't be blank"
  end

  def test_post_requires_unique_slug
    @post.save!
    another_post = create(:post, user: @user, categories: [@category], title: @post.title)
    another_post.slug = @post.slug
    assert_not another_post.valid?
    assert_includes another_post.errors[:slug], "has already been taken"
  end

  def test_post_sets_slug_on_create
    @post.save!
    assert_not_nil @post.slug
    assert_equal @post.title.parameterize, @post.slug
  end

  def test_post_slug_cannot_be_changed_after_creation
    @post.save!
    original_slug = @post.slug
    @post.slug = "new-slug"
    assert_not @post.valid?
    assert_includes @post.errors[:slug], "is immutable!"
  end

  def test_post_belongs_to_user
    assert_equal @user, @post.user
  end

  def test_post_has_categories
    assert_includes @post.categories, @category
  end

  def test_post_has_status_enum
    assert_includes Post.statuses.keys, "draft"
    assert_includes Post.statuses.keys, "published"
  end
end
