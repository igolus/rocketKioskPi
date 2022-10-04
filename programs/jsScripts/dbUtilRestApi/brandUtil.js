

const getBrand = async (brandId) => {
    const doc = await fireBaseDb
        .collection(brandsCollection)
        .doc(brandId)
        .get();

    return doc.exists && doc.data();
}

module.exports = {
    getBrand: getBrand,
}

