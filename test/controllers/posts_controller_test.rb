# frozen_string_literal: true

require "test_helper"

class PostsControllerTest < ActionDispatch::IntegrationTest
  include FactoryBot::Syntax::Methods

  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category)
    @post = create(:post, user: @user, categories: [@category])
    @headers = headers(@user)
  end

  def test_should_get_index
    get posts_url, headers: @headers
    assert_response :success
    assert_includes @response.body, @post.title
  end

  def test_should_create_post_with_valid_params
    post_params = {
      title: "New Post",
      description: "A valid description",
      status: "draft",
      category_ids: [@category.id]
    }
    assert_difference "Post.count", 1 do
      post posts_url, params: { post: post_params }, headers: @headers
    end
    assert_response :success
    assert_includes @response.body, "Post created successfully"
  end

  def test_should_not_create_post_with_invalid_params
    post_params = { title: "", description: "", status: "", category_ids: [] }
    assert_no_difference "Post.count" do
      post posts_url, params: { post: post_params }, headers: @headers
    end
    assert_response :unprocessable_entity
    assert_includes @response.body, "can't be blank"
  end

  def test_should_show_post
    get post_url(slug: @post.slug), headers: @headers
    assert_response :success
    assert_includes @response.body, @post.title
  end

  def test_should_update_post
    patch post_url(slug: @post.slug), params: { post: { title: "Updated Title" } }, headers: @headers
    assert_response :success
    assert_includes @response.body, "Post was successfully updated"
    @post.reload
    assert_equal "Updated Title", @post.title
  end

  def test_should_destroy_post
    assert_difference "Post.count", -1 do
      delete post_url(slug: @post.slug), headers: @headers
    end
    assert_response :success
  end

  def test_should_filter_posts_by_category_name
    category2 = create(:category, name: "SpecialCategory")
    post2 = create(:post, user: @user, categories: [category2])

    get posts_url, params: { category_names: [category2.name] }, headers: @headers
    assert_response :success
    assert_includes @response.body, post2.title
    refute_includes @response.body, @post.title unless @post.categories.include?(category2)
  end

  def test_should_filter_posts_by_category_id
    category2 = create(:category)
    post2 = create(:post, user: @user, categories: [category2])

    get posts_url, params: { category_ids: [category2.id] }, headers: @headers
    assert_response :success
    assert_includes @response.body, post2.title
    refute_includes @response.body, @post.title unless @post.categories.include?(category2)
  end

  def test_should_filter_posts_by_user_id
    user2 = create(:user, organization: @organization)
    post2 = create(:post, user: user2, categories: [@category])

    get posts_url, params: { user_id: user2.id }, headers: @headers
    assert_response :success
    assert_includes @response.body, post2.title
    refute_includes @response.body, @post.title unless @post.user == user2
  end

  def test_should_not_authenticate_with_invalid_token
    invalid_headers = {
      "X-Auth-Email" => @user.email,
      "X-Auth-Token" => "invalid_token",
      "Accept" => "application/json"
    }
    get posts_url, headers: invalid_headers
    assert_response :unauthorized
    assert_includes @response.body, "Could not authenticate with the provided credentials"
  end

  def test_should_not_authorize_user_for_forbidden_action
    other_user = create(:user, organization: @organization)
    other_headers = headers(other_user)
    delete post_url(slug: @post.slug), headers: other_headers
    assert_response :forbidden
    assert_includes @response.body, "Access denied. You are not authorized to perform this action."
  end
end
