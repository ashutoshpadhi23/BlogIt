# frozen_string_literal: true

class PostsController < ApplicationController
  after_action :verify_authorized, except: :index
  after_action :verify_policy_scoped, only: :index
  before_action :load_post!, only: %i[show update destroy]
  def index
    # @posts = Post.all.as_json(include: [:user, :categories])
    @posts = policy_scope(Post)
    @posts = @posts.all.includes(:categories, user: :organization)
    @posts = filter_posts_by_category_name_or_category_id(@posts)
    @posts = filter_posts_by_user_id(@posts) if params[:user_id].present?
    @posts = @posts.where("title LIKE ?", "%#{params[:title]}%") if params[:title].present?
    @posts = @posts.where(status: params[:status]) if params[:status].present?
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

  # def update
  #   authorize @post
  #   @post.update!(post_params)
  #   render_notice("Post was successfully updated") unless params.key?(:quiet)
  # end

  # def destroy
  #   authorize @post
  #   @post.destroy!
  #   render_json
  # end

  def update
    authorize @post
    retries ||= 0
    begin
      @post.update!(post_params)
      render_notice("Post was successfully updated") unless params.key?(:quiet)
    rescue ActiveRecord::StatementInvalid => e
      if e.message =~ /database is locked/i && (retries += 1) <= 3
        sleep(0.2 * retries)
        retry
      else
        render_error(e.message, :unprocessable_entity)
      end
    end
  end

  def destroy
    authorize @post
    retries ||= 0
    begin
      @post.destroy!
      render_json
    rescue ActiveRecord::StatementInvalid => e
      if e.message =~ /database is locked/i && (retries += 1) <= 3
        sleep(0.2 * retries)
        retry
      else
        render_error(e.message, :unprocessable_entity)
      end
    end
  end

  private

    def post_params
      params.require(:post).permit(:title, :description, :status, :user_id, category_ids: [])
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

    def filter_posts_by_user_id(base_scope)
      base_scope = base_scope.includes(user: :organization)
      base_scope.where(user_id: params[:user_id])
    end
end
