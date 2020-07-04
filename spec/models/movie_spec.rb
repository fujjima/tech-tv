# == Schema Information
#
# Table name: movies
#
#  id                     :bigint           not null, primary key
#  url(動画のURL)         :string           default(""), not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  event_id(イベントのID) :bigint           not null
#
# Indexes
#
#  index_movies_on_event_id  (event_id)
#
# Foreign Keys
#
#  fk_rails_...  (event_id => events.id)
#
require 'rails_helper'

RSpec.describe Movie, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
