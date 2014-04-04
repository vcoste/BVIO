class Product < ActiveRecord::Base

	belongs_to :category
  has_many :reviews

  def get_reviews_by_area(t_left, t_right, b_left, b_right)
    reviews = self.reviews
    reviews.select!{|r|
      r.latitude >= t_right['latitude'].to_f and r.latitude <= b_right['latitude'].to_f and r.latitude >= t_left['latitude'].to_f and r.latitude <= b_left['latitude'].to_f and
      r.longitude <= t_right['longitude'].to_f and r.longitude >= t_left['longitude'].to_f and r.longitude >= b_left['longitude'].to_f and r.longitude <= b_right['longitude'].to_f
    }
    puts reviews.length
    reviews
  end

end
