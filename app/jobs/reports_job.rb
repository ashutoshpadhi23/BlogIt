# frozen_string_literal: true

class ReportsJob
  include Sidekiq::Job

  def perform(post_slug)
    ActionCable.server.broadcast(post_slug, { message: I18n.t("report.render"), progress: 25 })
    post = Post.find_by!(slug: post_slug)
    html_report = ApplicationController.render(
      assigns: {
        post:
      },
      template: "posts/report/download",
      layout: "pdf"
    )
    ActionCable.server.broadcast(post_slug, { message: I18n.t("report.generate"), progress: 50 })
    pdf_report = WickedPdf.new.pdf_from_string html_report

    ActionCable.server.broadcast(post_slug, { message: I18n.t("report.upload"), progress: 75 })
    if post.report.attached?
      post.report.purge
    end
    post.report.attach(
      io: StringIO.new(pdf_report), filename: "report.pdf",
      content_type: "application/pdf")
    post.save!
    ActionCable.server.broadcast(post_slug, { message: I18n.t("report.attach"), progress: 100 })
  end
end
