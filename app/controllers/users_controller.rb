# frozen_string_literal: true

class UsersController < ApplicationController
  def index
    @users = User.all
  end

  def create
    user = User.new(user_params)
    user.save!
    render_notice("User was created successfully")
  end

  private

    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation)
    end
end
