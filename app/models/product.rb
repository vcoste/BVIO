class Product < ActiveRecord::Base

	belongs_to :category
  has_many :reviews

  def get_avg_rating_by_location(t_left, t_right, b_left, b_right)
    reviews = self.reviews
    reviews.select!{|r|
      r.latitude <= t_right.latitude and r.latitude <= b_right.latitude and r.latitude >= t_left.latitude and r.latitude >= b_left.latitude and
      r.longitude <= t_right.longitude and r.longitude <= t_left.longitude and r.longitude >= b_left.longitude and r.longitude >= b_right.longitude
    }
    # todo, make a time thing
    avg_rating = reviews.map{|r| r.rating}.inject(:+) / reviews.length
    avg_rating
  end

end
