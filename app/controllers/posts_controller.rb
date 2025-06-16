# frozen_string_literal: true

class PostsController < ApplicationController
  before_action :load_post!, only: %i[show]
  def index
    posts = Post.all.as_json(include: [:user, :categories])
    render status: :ok, json: { posts: }
  end

  def create
    post = Post.new(post_params)
    post.save!
    render_notice("Post created successfully")
  end

  def show
    # render_json({ post: @post })
    single_post = @post.as_json(include: [:user, :categories])
    render status: :ok, json: { post: single_post }
  end

  private

    def post_params
      params.require(:post).permit(:title, :description, :user_id, category_ids: [])
    end

    def load_post!
      @post = Post.find_by!(slug: params[:slug])
    end
end
