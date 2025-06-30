# frozen_string_literal: true

class ReportsJob
  include Sidekiq::Job

  def perform(post_slug, report_path)
    post = Post.find_by!(slug: post_slug)
    puts post.inspect
    puts post_slug
    content = ApplicationController.render(
      assigns: {
        post: post
      },
      template: "posts/report/download",
      layout: "pdf"
    )
    pdf_blob = WickedPdf.new.pdf_from_string content
    File.open(report_path, "wb") do |f|
      f.write(pdf_blob)
    end
  end
end
