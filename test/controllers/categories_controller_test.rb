# frozen_string_literal: true

require "test_helper"

class CategoriesControllerTest < ActionDispatch::IntegrationTest
  include FactoryBot::Syntax::Methods

  def setup
    @post = create(:post)
    @category = create(:category)
    @headers = headers(@post.user)
  end

  def test_should_get_index
    get categories_url, headers: @headers
    assert_response :success
    assert_includes @response.body, @category.name
  end

  def test_should_create_category_with_valid_params
    category_params = { name: "NewCategory" }
    assert_difference "Category.count", 1 do
      post categories_url, params: { category: category_params }, headers: @headers
    end
    assert_response :success
    assert_includes @response.body, "Category created successfully"
  end

  def test_should_not_create_category_with_invalid_params
    category_params = { name: "" }
    assert_no_difference "Category.count" do
      post categories_url, params: { category: category_params }, headers: @headers
    end
    assert_response :unprocessable_entity
    assert_includes @response.body, "can't be blank"
  end
end
