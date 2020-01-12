const detailKajian = () => {
  const model = {
    title: '',
    photoKajian: '',
    linkKajian: '',
    date: '',
    time: '',
    description: '',
    location: '',
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
