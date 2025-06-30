# frozen_string_literal: true

class Posts::ReportsController < ApplicationController
  before_action :load_post, only: [:download]
  def create
    ReportsJob.perform_async(post_slug)
  end

  def download
    if File.exist?(report_path)
      send_file(
        report_path,
        type: "application/pdf",
        filename: pdf_file_name,
        disposition: "attachment"
      )
    else
      render_error("Report not found", :not_found)
    end
    unless @post.report.attached?
      render_error("Report not found", :not_found) and return
    end

    send_data @post.report.download, filename: pdf_file_name, content_type: "application/pdf"
  end

  private

    def report_path
      @_report_path ||= Rails.root.join("tmp/#{pdf_file_name}")
    end

    def load_post
      @post = Post.find_by!(slug: post_slug)
    end

    def pdf_file_name
      "blogit_post_report.pdf"
    end

    def post_slug
      params[:post_slug] || params[:slug]
    end
end
