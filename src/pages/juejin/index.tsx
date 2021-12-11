import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import ReactTooltip from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';
import './styles.css'
import data from '../../assets/article.json'
import dayjs from 'dayjs';

interface ValueList {
    date: Date,
    count: number,
    article: string,
    digg_count: number,
    view_count: number,
    ctime: number,
    time: string
}
interface ShowList {
    date: string,
    count: number,
    title: ValueList[]
}

const JueJin: React.FC = () => {
    const today = new Date();
    const allArticle = [] as ValueList[]
    // 把数据合并
    for (const i in data) {
        allArticle.push(...data[i] as [])
    }
    // 根据时间排序，无所谓
    allArticle.sort((a, b) => a.ctime - b.ctime)
    // 添加 time 字段，记录发布的时间
    allArticle.map(item => item.time = dayjs.unix(item.ctime).format('YYYY-MM-DD'))
    // 处理日期和发文数量
    const articleMap = new Map()
    // 建立日期和数量映射
    allArticle.forEach(item => {
        // 有这一天就+1，没有就是 1 
        articleMap.has(item.time) ? articleMap.set(item.time, articleMap.get(item.time) + 1) : articleMap.set(item.time, 1)
    })
    console.log(articleMap);
    // 建立渲染数据格式 {date: ,count: , title: [{}, {}]}
    let showData = [] as ShowList[]
    for (let [k, v] of articleMap) {
        const titleList = allArticle.filter(item => item.time === k)
        showData = [...showData, { date: k, count: v, title: titleList }]
    }
    console.log(showData);

    console.log(allArticle);


    const randomValues = getRange(365).map(index => {
        const tempDate = shiftDate(today, -index)
        const current = showData.find(item => item.date === tempDate)
        return {
            date: tempDate,
            count: current?.count ?? 0,
            title: current?.title ?? ''
        };
    });

    function shiftDate(date, numDays) {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + numDays);
        return dayjs(newDate).format('YYYY-MM-DD');
    }

    function getRange(count) {
        return Array.from({ length: count }, (_, i) => i);
    }

    return (
        <div style={{ width: "1400px", height: "600px" }}>
            <h2 style={{ marginBottom: "40px", textAlign: "center" }}> 2021 掘金发文记录</h2>
            <h4 style={{ marginBottom: "40px", textAlign: "center" }}>总共发文 {allArticle.length} 篇 </h4>
            <CalendarHeatmap
                startDate={new Date('2021-01-01')}
                endDate={new Date('2021-12-31')}
                values={randomValues}
                classForValue={value => {
                    if (!value) {
                        return 'color-empty';
                    }
                    // 大于4篇显示4篇的颜色
                    return `color-github-${value.count > 4 ? 4 : value.count}`;
                }}
                tooltipDataAttrs={(value) => {
                    console.log(value.title);

                    // 这个回调的参数其实就是对应天数的value值，包含date和count属性
                    return {
                        'data-tip': `${value.date} 发了 ${value.count ?? 0} 篇文章 ${value.title && value.title[0].title}`,
                        rx: 2,
                    }
                }}
                showWeekdayLabels={true}
            />
            <ReactTooltip />
        </div>
    );
};

export default JueJin;