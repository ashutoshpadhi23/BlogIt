# frozen_string_literal: true

class CategoriesController < ApplicationController
  def index
    categories = Category.all
    render_json(categories:)
  end

  def create
    category = Category.new(category_params)
    category.save!
    render_notice("Category created successfully")
  end

  private

    def category_params
      params.require(:category).permit(:name)
    end
end
