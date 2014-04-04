class Review < ActiveRecord::Base
  attr_accessor :longitude, :latitude

  belongs_to :author
  belongs_to :product

  # number of reviews, average rating, satisfaction

  def self.get_avg_rating(reviewArray)
  	ratingSum = reviewArray.map{ |r| r.rating }.inject(:+)
  	avg = reviewArray.length > 0 ? ratingSum.to_f/reviewArray.length : 0
  	return avg
  end

  def self.get_number_of_reviews(reviewArray)
  	return reviewArray.length
  end

  def self.get_satisfaction(reviewArray)
  	satisfactionSum = 0
  	reviewArray.each { |r| satisfactionSum += 1 if r.is_recommended }
  	satisfaction = reviewArray.length > 0 ? (satisfactionSum/reviewArray.length) * 100.00 : 0.00 #return a percentage
  	return satisfaction
  end

  def self.get_helpfulness(reviewArray)
  	helpfulnessSum = 0
  	totalHelpfulness = 0
  	reviewArray.each { |r| 
  	  if r.nil?
  			# do not count (should be NULL)
	   else
	  	totalHelpfulness ++
	  	helpfulnessSum += r.helpfulness
	  end
  	}
  	helpfulness = totalHelpfulness > 0 ? (helpfulnessSum/totalHelpfulness) * 100.00 : 0.00 #return a percentage
  	return helpfulness
  end

  def self.tag_count(reviewArray)
    tag_hash = Hash.new
    tag_array = Array.new
    tag_hash.default = 0
    
    reviewArray.each { |r|
    tag_string = r.tags 
      if tag_string.nil?
        #do nothing
      else
        product_tags = JSON.parse(tag_string)
        product_tags.each { |tag| 
          tag_hash[tag] += 1
        }
      end
    }

    tag_hash.each { |key,value|
      tag_array << {key => value}
    }
    tag_array.sort_by!{ |t|
      t.values.first
    }.reverse!

    return tag_array
  end

end
