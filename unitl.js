export default class Until {
    static sleep(n) {
        var start = new Date().getTime();
        while (true) {
            if (new Date().getTime() - start > n) {
                break;
            }
        }
    }

    // 把字符串按固定长度分割成数组
	static splitString(str, leng) {
		var strArray = [];
		var index = 0;
		while (index < str.length) {
			var sliceString = str.slice(index, (index += leng));
			strArray.push(sliceString);
		}
		return strArray;
	}

    // 判断字符串是以什么开头的
    static confirmStart(str, target) {
        if (str.length > target.length) {
			if (str.substr(0, target.length) == target)
				return true;
			else return false;
		}
		return false;
    }
}
