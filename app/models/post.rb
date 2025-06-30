# frozen_string_literal: true

class Post < ApplicationRecord
  MAXIMUM_TITLE_LENGTH = 125
  MAXIMUM_DESCRIPTION_LENGTH = 10000

  enum :status, { draft: "draft", published: "published" }, default: :draft
  belongs_to :user
  has_many :post_votes, dependent: :destroy
  has_and_belongs_to_many :categories
  has_one_attached :report
  # belongs_to :organization, through: :user

  validates :title, presence: true, length: { maximum: MAXIMUM_TITLE_LENGTH }
  validates :description, presence: true, length: { maximum: MAXIMUM_DESCRIPTION_LENGTH }
  validates_inclusion_of :is_bloggable, in: [true, false]
  validates :slug, uniqueness: true
  validates :categories, presence: true
  validate :slug_not_changed

  before_create :set_slug

  def net_votes
    upvotes - downvotes
  end

  def update_bloggable_status!
    threshold = Rails.application.config.bloggable_threshold
    update!(is_bloggable: net_votes > threshold)
  end

  private

    def set_slug
      title_slug = title.parameterize
      regex_pattern = "slug #{Constants::DB_REGEX_OPERATOR} ?"
      latest_post_slug = Post.where(
        regex_pattern,
        "^#{title_slug}$|^#{title_slug}-[0-9]+$"
      ).order("LENGTH(slug) DESC", slug: :desc).first&.slug
      slug_count = 0
      if latest_post_slug.present?
        slug_count = latest_post_slug.split("-").last.to_i
        only_one_slug_exists = slug_count == 0
        slug_count = 1 if only_one_slug_exists
      end
      slug_candidate = slug_count.positive? ? "#{title_slug}-#{slug_count + 1}" : title_slug
      self.slug = slug_candidate
    end

    def slug_not_changed
      if will_save_change_to_slug? && self.persisted?
        errors.add(:slug, I18n.t("post.slug.immutable"))
      end
    end
end
