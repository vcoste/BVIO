# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140403142625) do

  create_table "authors", force: true do |t|
    t.string   "gender"
    t.string   "author_id"
    t.string   "location"
    t.string   "username"
    t.float    "location_latitude"
    t.float    "location_longitude"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "categories", force: true do |t|
    t.string   "category_page_url"
    t.string   "category_id"
    t.string   "image_url"
    t.string   "name"
    t.string   "parent_id_str"
    t.integer  "parent_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "products", force: true do |t|
    t.string   "category_id_str"
    t.integer  "category_id"
    t.string   "description"
    t.string   "product_id"
    t.string   "image_url"
    t.string   "name"
    t.string   "product_page_url"
    t.float    "average_rating"
    t.string   "gender_data"
    t.integer  "helpful_vote_count"
    t.integer  "not_helpful_vote_count"
    t.integer  "not_recommended_count"
    t.integer  "overall_rating_range"
    t.string   "rating_distribution"
    t.integer  "recommended_count"
    t.float    "effectiveness"
    t.float    "satisfaction"
    t.integer  "num_reviews"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "reviews", force: true do |t|
    t.string   "author_id_str"
    t.integer  "author_id"
    t.string   "review_id"
    t.string   "product_id_str"
    t.integer  "product_id"
    t.integer  "rating"
    t.text     "review_text"
    t.string   "title"
    t.float    "helpfulness"
    t.integer  "total_comment_count"
    t.integer  "total_feedback_count"
    t.integer  "total_negative_feedback_count"
    t.integer  "total_positive_feedback_count"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "test", id: false, force: true do |t|
    t.integer "id"
    t.string  "swagger_ratio", limit: 50
    t.integer "awesome_index"
  end

end
