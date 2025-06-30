# frozen_string_literal: true

class Posts::ReportsController < ApplicationController
  def create
    ReportsJob.perform_async(post_slug, report_path.to_s)
    render_notice("Report generation in progress")
  end

  def download
    puts report_path
    puts pdf_file_name
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
  end

  private

    def report_path
      @_report_path ||= Rails.root.join("tmp/#{pdf_file_name}")
    end

    def pdf_file_name
      "blogit_post_report.pdf"
    end

    def post_slug
      params[:post_slug] || params[:slug]
    end
end
