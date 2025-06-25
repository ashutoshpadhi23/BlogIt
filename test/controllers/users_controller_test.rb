# frozen_string_literal: true

require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  include FactoryBot::Syntax::Methods

  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @headers = headers(@user)
  end

  def test_should_get_index
    get users_path, headers: @headers
    assert_response :success
    response_json = response.parsed_body

    expected_user_ids = User.pluck(:id).sort
    actual_user_ids = response_json.pluck("id").sort
    assert_equal expected_user_ids, actual_user_ids
  end

  def test_should_create_user_with_valid_params
    user_params = {
      name: "Test User",
      email: "testuser@example.com",
      password: "welcome",
      password_confirmation: "welcome",
      organization_id: @organization.id
    }
    assert_difference "User.count", 1 do
      post users_url, params: { user: user_params }, headers: @headers
    end
    assert_response :success
    assert_includes @response.body, "User was created successfully"
  end

  def test_should_not_create_user_with_invalid_params
    user_params = { name: "", email: "", password: "", password_confirmation: "", organization_id: nil }
    assert_no_difference "User.count" do
      post users_url, params: { user: user_params }, headers: @headers
    end
    assert_response :unprocessable_entity
    assert_includes @response.body, "can't be blank"
  end
end
