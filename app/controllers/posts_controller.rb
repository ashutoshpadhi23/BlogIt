# frozen_string_literal: true

class PostsController < ApplicationController
  after_action :verify_authorized, except: :index
  after_action :verify_policy_scoped, only: :index
  before_action :load_post!, only: %i[show update]
  def index
    # @posts = Post.all.as_json(include: [:user, :categories])
    @posts = policy_scope(Post)
    @posts = @posts.all.includes(:categories, user: :organization)
    @posts = filter_posts_by_category_name_or_category_id(@posts)
    # render status: :ok, json: { posts: }
    render
  end

  def create
    post = Post.new(post_params)
    post.user_id = current_user.id
    authorize post
    post.save!
    render_notice("Post created successfully")
  end

  def show
    authorize @post
  end

  def update
    authorize @post
    @post.update!(post_params)
    render_notice("Post was successfully updated")
  end

  private

    def post_params
      params.require(:post).permit(:title, :description, category_ids: [])
    end

    def load_post!
      @post = Post.find_by!(slug: params[:slug])
    end

    def filter_posts_by_category_name_or_category_id(base_scope)
      base_scope = base_scope.includes(user: :organization)

      if params[:category_names].present?
        names = params[:category_names]
        categories_post_join = base_scope.joins(:categories)
        filtered_posts = categories_post_join
          .where(categories: { name: names })
          .group("posts.id")
          .having("COUNT(DISTINCT categories.name) = ?", names.size)
          .distinct
        post_ids = filtered_posts.pluck(:id)
        base_scope.where(id: post_ids)
      elsif params[:category_ids].present?
        categories_post_join = base_scope.joins(:categories)
        filtered_posts = categories_post_join
          .where(categories: { id: params[:category_ids] })
          .group("posts.id")
          .having("COUNT(DISTINCT categories.id) = ?", params[:category_ids].size)
          .distinct
        post_ids = filtered_posts.pluck(:id)
        base_scope.where(id: post_ids)
      else
        base_scope.all
      end
    end
end
