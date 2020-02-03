const detailKajian = () => {
  const model = {
    title: '',
    image: '',
    linkVideo: '',
    categoryName: '',
    startDate: '',
    endDate: '',
    timeStart: '',
    timeEnd: '',
    description: '',
    locationMap: '',
    latitude: '',
    longitude: '',
    attended: [],
    countAttended: '',
    ustadz: []
  }
  return model
}

module.exports = {
  detailKajian
}
